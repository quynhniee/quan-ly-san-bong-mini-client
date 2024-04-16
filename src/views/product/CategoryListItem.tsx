import {
  Box,
  Checkbox,
  InlineStack,
  RadioButton,
  Text,
} from "@shopify/polaris";
import { Category } from "../../interface";

interface ICategoryListItem {
  category: Category;
  selectedCategories: Category[];
  setSelectedCategories: any;
  onlyChoice?: boolean;
  closePopover?: Function;
  setCategory?: Function;
}

export const CategoryListItem = function ListItem({
  category,
  selectedCategories,
  setSelectedCategories,
  onlyChoice,
  closePopover,
  setCategory,
}: ICategoryListItem) {
  console.log({ selectedCategories });

  const handleChangeSelectedCategories = () => {
    const newChecked = !selectedCategories
      .map((p) => p.id)
      .includes(category.id);

    onlyChoice
      ? setSelectedCategories([category])
      : setSelectedCategories((preState: Category[]) =>
          newChecked
            ? [...preState, category]
            : preState.filter((p) => p.id !== category.id)
        );

    typeof closePopover === "function" && closePopover();
    typeof setCategory === "function" && setCategory(category);
  };

  return (
    <div
      className={`ot-select-item`}
      onClick={(e) => handleChangeSelectedCategories()}
    >
      <Box
        borderBlockEndWidth="025"
        borderColor="border"
        paddingBlockStart="200"
        paddingBlockEnd="200"
        paddingInlineStart="400"
        paddingInlineEnd="400"
      >
        <InlineStack gap={"400"} align="start" blockAlign="center" wrap={false}>
          {onlyChoice ? (
            <RadioButton
              value={`${category.id}`}
              ariaDescribedBy="category"
              label={category.name}
              labelHidden
              checked={selectedCategories.map((p) => p.id).includes(category.id)}
              onChange={() => {
                handleChangeSelectedCategories();
                typeof closePopover === "function" && closePopover();
              }}
            />
          ) : (
            <Checkbox
              value={`${category.id}`}
              label={category.name}
              labelHidden
              onChange={handleChangeSelectedCategories}
              checked={selectedCategories.map((p) => p.id).includes(category.id)}
            />
          )}

          <Text as="span" variant="bodyMd" truncate>
            {category.name}
          </Text>
        </InlineStack>
      </Box>
    </div>
  );
};
