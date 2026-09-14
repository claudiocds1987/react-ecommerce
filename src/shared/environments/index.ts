import { environment as devEnvironment } from './environment';
import { environment as prodEnvironment } from './environment.production';

// import.meta.env.PROD es provisto nativamente por Vite según el comando ejecutado (build vs dev)
export const environment = import.meta.env.PROD ? prodEnvironment : devEnvironment;