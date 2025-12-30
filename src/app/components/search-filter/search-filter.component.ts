import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  standalone: false,
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss'
})
export class SearchFilterComponent {
  @Output() filterChange = new EventEmitter<any>();

  searchTerm = '';
  gender = '';
  dateFrom = '';
  dateTo = '';

  onSearchChange(): void {
    this.emitFilters();
  }

  onGenderChange(): void {
    this.emitFilters();
  }

  onDateChange(): void {
    this.emitFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.gender = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.emitFilters();
  }

  private emitFilters(): void {
    this.filterChange.emit({
      searchTerm: this.searchTerm,
      gender: this.gender,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo
    });
  }
}
