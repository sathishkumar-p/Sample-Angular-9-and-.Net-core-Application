import { LogLevel } from 'ngx-fancy-logger';

export const environment = {
  production: true,
  apiUrl: 'http://localhost:5000/api/', 
  loggerConfig:{
    showTime: true,
    showEmoji: true, 
    showLabel: true,
    logLevel: LogLevel.DEBUG,
    levelColor: {
      [LogLevel.DEBUG] : 'black',
      [LogLevel.WARNING] : 'orange',
      [LogLevel.ERROR]: 'red'
    }
  }
};
