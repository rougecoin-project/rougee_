import {useEffect} from 'react';
import {useStore} from '../../../state/store';
import {FilterButton} from './filter-button';
import {
  ScrollableView,
  ScrollableViewItem,
} from '../../../ui/navbar/scrollable-view';
import {tools} from '../../../state/utils';

export function FilterNav() {
  const filters = useStore(s => s.config.tools?.filter?.items) || [];

  useEffect(() => {
    tools().filter.syncState();
  }, []);

  const filterBtns = filters.map(filter => (
    <ScrollableViewItem key={filter}>
      <FilterButton filter={filter} />
    </ScrollableViewItem>
  ));
  return <ScrollableView>{filterBtns}</ScrollableView>;
}
