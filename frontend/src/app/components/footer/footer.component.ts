import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <span class="logo">📚 Bookly</span>
        <p>&copy; {{ year }} Bookly. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-secondary);
      padding: 1.5rem;
    }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .logo {
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 1rem;
      color: var(--text-secondary);
    }
    p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
  `],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
