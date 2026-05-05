import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterModule],
  template: `
    <div class="layout">
      <app-navbar />
      <main class="main-content">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--bg-primary);
    }
    .main-content {
      flex: 1;
      width: 100%;
      max-width: 960px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    @media (max-width: 768px) {
      .main-content { padding: 1rem; }
    }
  `],
})
export class LayoutComponent {}
