import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { AppShell } from './app/app-shell';
import { appConfig } from './app/app.config';

bootstrapApplication(AppShell, {...appConfig, providers: [provideZoneChangeDetection(), ...appConfig.providers]});
