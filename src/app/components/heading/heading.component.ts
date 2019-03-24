import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class Heading {
  title = 'Equestrian Vault';
  subtitle = 'FIND YOUR FAVORITE MLP FANFICS IN PRINT';
}
