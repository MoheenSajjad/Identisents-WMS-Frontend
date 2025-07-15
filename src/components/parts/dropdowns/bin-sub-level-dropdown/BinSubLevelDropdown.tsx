// import { useToggle } from '@/hooks/use-toggle';
// import {
//   DropdownContent,
//   DropdownDialog,
//   DropdownEmpty,
//   DropdownInput,
//   DropdownItem,
//   DropdownItemName,
//   DropdownList,
//   DropdownTrigger,
// } from '../../dropdown/Dropdown';
// import { useMemo, useRef, useState } from 'react';
// import { useOnClickOutside } from '@/hooks/use-click-outside';
// import { IDropdownOption } from '@/types/dropdown';
// import { IBinSubLevels } from '@/types/bin-sub-levels';

// interface IBinSubLevelDropdownProps extends IDropdownOption<IBinSubLevels, string> {
//   label?: string;
//   options?: IBinSubLevels[];
//   isLoading?: boolean;
//   showLabel?: boolean;
// }

// export const BinSubLevelDropdown: React.FC<IBinSubLevelDropdownProps> = ({
//   value,
//   label,
//   onSelect,
//   placeholder = 'Select bin sub level...',
//   isDisabled = false,
//   hasError = false,
//   error,
//   className,
//   options,
//   showLabel = true,
//   isRequired = false,
//   isLoading = false,
// }) => {
//   const { isToggled, toggle, toggleOff } = useToggle();
//   const [searchTerm, setSearchTerm] = useState('');
//   const dialogRef = useRef<any>(null);

//   const binSubLevels = useMemo(() => options ?? [], [options]);

//   const filteredBinSubLevels = useMemo(() => {
//     if (!searchTerm.trim()) return binSubLevels;

//     const searchLower = searchTerm.toLowerCase();
//     return binSubLevels.filter(sub =>
//       sub.binLocationSubLevel?.name?.toLowerCase().includes(searchLower)
//     );
//   }, [binSubLevels, searchTerm]);

//   const selectedBinSubLevel = useMemo(() => {
//     return binSubLevels.find(s => s._id === value);
//   }, [value, binSubLevels]);

//   const handleSelectBinSubLevel = (subLevel: IBinSubLevels) => {
//     onSelect?.(subLevel);
//     toggleOff();
//   };

//   const handleToggleDropdown = () => {
//     if (!isDisabled) {
//       toggle();
//       if (!isToggled) setSearchTerm('');
//     }
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   useOnClickOutside(dialogRef, toggleOff);

//   return (
//     <DropdownDialog isOpen={isToggled} className={`${className} w-full`} ref={dialogRef}>
//       <DropdownTrigger
//         selectedItems={value ? [value] : []}
//         label={label ?? 'Bin Sub Level'}
//         isRequired={isRequired}
//         placeholder={placeholder}
//         toggleDropdown={handleToggleDropdown}
//         renderSelected={() => selectedBinSubLevel?.binLocationSubLevel?.name || ''}
//         isLoading={isLoading}
//         showLabel={showLabel}
//         isDisabled={isDisabled || isLoading}
//         hasError={hasError}
//         error={error}
//         isMultiple={false}
//         className="w-full"
//       />

//       <DropdownContent isOpen={isToggled}>
//         <DropdownInput
//           value={searchTerm}
//           onChange={handleSearchChange}
//           placeholder="Search bin sub level..."
//         />

//         <DropdownList>
//           {!isLoading && filteredBinSubLevels.length === 0 && (
//             <DropdownEmpty message="No bin sub levels found" />
//           )}

//           {filteredBinSubLevels.map(sub => (
//             <DropdownItem
//               key={sub._id}
//               onClick={() => handleSelectBinSubLevel(sub)}
//               isSelected={sub._id === value}
//             >
//               <DropdownItemName>{sub.binLocationSubLevel?.name}</DropdownItemName>
//             </DropdownItem>
//           ))}
//         </DropdownList>
//       </DropdownContent>
//     </DropdownDialog>
//   );
// };
