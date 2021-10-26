import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  /**
   * Your custom Filter
   */
  transform(data: any[], query: string): any[] {
    if (!query) {
      return data;
    }

    return data.filter((obj) => {
      return obj.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
  }
}
