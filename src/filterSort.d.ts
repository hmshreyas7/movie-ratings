type SelectedOption = {
  value: string;
  label: string;
};

type FilterSort = {
  runtimeFilter: SelectedOption[];
  genreFilter: SelectedOption[];
  decadeFilter: SelectedOption[];
  sortSetting: SelectedOption | null;
};
