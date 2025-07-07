export interface IDropdownOption<T, K> {
  value?: K;
  onSelect?: (data: T) => void;
  placeholder?: string;
  isDisabled?: boolean;
  hasError?: boolean;
  error?: string;
  className?: string;
  isRequired?: boolean;
}
