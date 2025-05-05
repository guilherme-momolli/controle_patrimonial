import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from "../components/assets/header/header.component";
import { BodyComponent } from "../components/assets/body/body.component";
import { FooterComponent } from "../components/assets/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: '<div [innerHTML]="htmlContent"></div>',
})
export class AppComponent implements OnInit{
  title = 'controle_patrimonial';
  toggleDarkMode() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      document.body.classList.toggle('dark-mode');

      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
      } else {
        localStorage.removeItem('darkMode');
      }
    }
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
      }
    }
  }
}
