import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import axios from 'axios';
import path from 'path';

import { SeoHelper } from './utils/seo-helper';
import { Config } from './utils/config';
import { Car } from './interfaces/car';
import { UsedCarPart } from './interfaces/used-car-part';

dotenv.config();

// 🚀 Config, keys and sessions
const config = new Config();

const app = express();
app.use(express.json());

// 📁 Paths and constants
const INDEX_HTML_PATH = config.get('INDEX_HTML_PATH');
const MAINTENANCE_HTML_PATH = config.get('MAINTENANCE_HTML_PATH');
const ROBOTS_TXT_PATH = config.get('ROBOTS_TXT_PATH');

const baseDomain = config
  .get('ORIGIN')
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '');

const allowedOrigins = [
  `https://${baseDomain}`,
  `https://www.${baseDomain}`,
  `http://${baseDomain}`,
  `http://www.${baseDomain}`,
];

// ✅ CORS setup
app.use(
  '/api',
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests

      const normalized = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(normalized)) {
        return callback(null, true);
      }

      console.warn(`❌ Blocked CORS request from: ${origin}`);
      console.warn(`Allowed origins:`, allowedOrigins);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(compression());
app.disable('x-powered-by');

app.use('/assets', express.static(config.get('ASSETS_DIR')));
app.use(
  '/static',
  express.static(config.get('STATIC_DIR'), {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', config.get('ORIGIN'));
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    },
  })
);

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

// robots.txt
app.get('/robots.txt', (_req: Request, res: Response) => {
  const absoluteRobotsPath = path.resolve(process.cwd(), ROBOTS_TXT_PATH);

  res.sendFile(absoluteRobotsPath, (err) => {
    if (err) {
      console.error('❌ Error serving robots.txt:', err);
      res.status(404).send('robots.txt not found');
    }
  });
});


async function fetchCarDetails(id: string): Promise<Car | null> {
  try {
    const response = await axios.get<Car>(`${config.get('API_URL')}/cars`, {
      headers: {
        'X-AUTH-KEY': config.get('API_AUTH_TOKEN'),
      },
      params: {
        id,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching car details:', error);
    return null;
  }
}

async function fetchUsedCarPartDetails(
  id: string
): Promise<UsedCarPart | null> {
  try {
    const response = await axios.get<UsedCarPart>(
      `${config.get('API_URL')}/used-car-parts`,
      {
        headers: {
          'X-AUTH-KEY': config.get('API_AUTH_TOKEN'),
        },
        params: {
          id,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching used car part details:', error);
    return null;
  }
}

const seo = new SeoHelper({
  siteName: 'American Muscle Cars',
  rootTitle: 'AMC',
  defaultPageTitle: 'Welcome',
  indexHtmlPath: INDEX_HTML_PATH,
  maintenanceHtmlPath: MAINTENANCE_HTML_PATH,
  faviconUrl: `/${config.get('STATIC_DIR')}/favicon.png`,
  isServerDown: config.get('SERVER_MAINTENANCE_MODE') === 'true',
});

// Main catch-all for HTML
app.get('*', async (req: Request, res: Response) => {
  const host = req.get('host');
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}`;

  let imageUrl = `${baseUrl}/${config.get('STATIC_DIR')}/banner.jpg`;
  let description = 'Discover the best American muscle cars and parts.';
  let customTitleSegment = '';

  if (req.path.startsWith('/inventory/car')) {
    const id = req.query.id as string;
    const car = await fetchCarDetails(id);
    if (car) {
      if (car.imageGallery?.length > 0) {
        const cleanPath = car.imageGallery[0].replace(/ /g, '%20');
        imageUrl = `${config.get('S3_PUBLIC_BASE_URL')}/${cleanPath}`;
      }
      description = `Check out the ${car.name}, ${car.year} model, `;
      if (car.salePrice) {
        description += `now available for a discounted price of ${car.salePrice} EUR.`;
      } else {
        description += `priced at ${car.price} EUR.`;
      }
      customTitleSegment = `${car.name} (${car.year})`;
    }
  } else if (req.path.startsWith('/inventory/used-car-part')) {
    const id = req.query.id as string;
    const part = await fetchUsedCarPartDetails(id);
    if (part) {
      if (part.imageGallery?.length > 0) {
        const cleanPath = part.imageGallery[0].replace(/ /g, '%20');
        imageUrl = `${config.get('S3_PUBLIC_BASE_URL')}/${cleanPath}`;
      }
      description = `Check out the ${part.name}, `;
      if (part.salePrice) {
        description += `now available for a discounted price of ${part.salePrice} EUR.`;
      } else {
        description += `priced at ${part.price} EUR.`;
      }
      customTitleSegment = part.name;
    }
  } else if (req.path !== '/') {
    const formattedTitle = seo.formatTitle(req.path.split('/')[1] || '');
    description = `Explore '${formattedTitle}' page on American Muscle Cars.`;
    customTitleSegment = formattedTitle;
  }

  const url = `${protocol}://${host}${req.originalUrl}`;

  const html = await seo.renderHtml({
    path: req.path,
    url,
    description,
    imageUrl,
    customTitleSegment,
  });

  res.send(html);
});

// Startup function with trusted client registration
async function start() {
  const PORT = parseInt(config.get('PORT'));
  const HOST = config.get('HOST');

  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
  });
}

start();
