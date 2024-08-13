import csurf from 'csurf';
import cookieParser from 'cookie-parser';

const csrfProtection = csurf({ cookie: true });

export { csrfProtection, cookieParser };