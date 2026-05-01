import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';


@Component({
  selector: 'app-order-row',
  standalone: true,
  imports: [NgClass, DecimalPipe],
  templateUrl: './order-row.html',
  styleUrl: './order-row.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderRow {
  @Input() order: any;
}
