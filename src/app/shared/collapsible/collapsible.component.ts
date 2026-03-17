import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collapsible',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="collapsible-container">
      <div class="collapsible-header" (click)="toggle()">
        <ng-content select="[header]"></ng-content>
        <span class="arrow" [class.expanded]="expanded">▼</span>
      </div>
      <div class="collapsible-content" [style.display]="expanded ? 'block' : 'none'">
        <div class="content-wrapper">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .collapsible-container {
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
      overflow: hidden;
      background: white;
    }
    .collapsible-header {
      padding: 12px 16px;
      background: #f5f5f5;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }
    .collapsible-header:hover {
      background: #ebebeb;
    }
    .collapsible-content {
      overflow: hidden;
    }
    .content-wrapper {
      padding: 16px;
    }
    .arrow {
      transition: transform 0.3s ease;
      font-size: 12px;
      color: #666;
    }
    .arrow.expanded {
      transform: rotate(180deg);
    }
  `]
})
export class CollapsibleComponent {
  @Input() expanded = false;
  @Output() expandedChange = new EventEmitter<boolean>();

  toggle() {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }
}
