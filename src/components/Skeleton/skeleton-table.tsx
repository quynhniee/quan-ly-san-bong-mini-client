import {
  Box,
  Card,
  Divider,
  InlineStack,
  Layout,
  SkeletonBodyText,
  SkeletonTabs,
  SkeletonThumbnail,
  Spinner,
  Text,
  BlockStack,
  useBreakpoints,
  IndexTable,
} from "@shopify/polaris";

const LoadingComponentOnIndexTableSkeleton = () => {
  return (
    <Box paddingInlineStart="500" paddingBlockStart="300" paddingBlockEnd="300">
      <InlineStack blockAlign="center">
        <div style={{ width: "20px", height: "20px" }}>
          <Spinner size="small" />
        </div>
        <Box paddingInlineStart="500">
          <Text as="p" tone="subdued">
            Loading data...
          </Text>
        </Box>
      </InlineStack>
    </Box>
  );
};

export const SkeletonOnlyTable = ({ number }: { number: number }) => {
  const { mdDown } = useBreakpoints();

  return (
    <>
      <LoadingComponentOnIndexTableSkeleton />
      {[1, 2, 3, 4].map((item) => {
        return mdDown ? (
          <SkeletonRowMobile key={item} />
        ) : (
          <SkeletonRowDesktop key={item} column={number} />
        );
      })}
    </>
  );
};

export function SkeletonTableMedia() {
  return (
    <Box padding="400">
      <BlockStack gap="400">
        {[1, 2, 3, 4].map((i) => (
          <InlineStack key={i} wrap={false} gap="400">
            <Box width="20px">
              <SkeletonBodyText lines={1} />
            </Box>
            <Box width="100px">
              <SkeletonThumbnail size="large" />
            </Box>
            <Box width="100%">
              <SkeletonBodyText />
            </Box>
            <Box width="100px">
              <SkeletonBodyText lines={1} />
            </Box>
            <Box width="100px">
              <SkeletonBodyText lines={1} />
            </Box>
          </InlineStack>
        ))}
      </BlockStack>
    </Box>
  );
}

const SkeletonIndexTable = ({ number }: { number: number }) => {
  const { mdDown } = useBreakpoints();
  return (
    <Layout>
      <Layout.Section>
        <Card padding={"0"}>
          <SkeletonTabs count={4} />
          {mdDown ? <Divider borderColor="border-secondary" /> : null}
          <LoadingComponentOnIndexTableSkeleton />
          <Divider borderColor="border-secondary" />
          {[0, 1, 2, 3].map((item) => {
            return mdDown ? (
              <SkeletonRowMobile key={item} />
            ) : (
              <SkeletonRowDesktop key={item} column={number} />
            );
          })}
        </Card>
      </Layout.Section>
    </Layout>
  );
};

export const SkeletonRowTableContent = ({ row, column }: { row: number, column: number }) => {
  return (
    <>
      {Array.from(Array(row).keys()).map((item) => {
        return (
          <IndexTable.Row position={item} id={item.toString()} key={item}>
            {Array.from(Array(column).keys()).map((item, index) => (
              <IndexTable.Cell key={index}>
                <SkeletonBodyText key={index} lines={1} />
              </IndexTable.Cell>
            ))}
          </IndexTable.Row>
        );
      })}
    </>
  );
};

const SkeletonRowDesktop = ({ column }: { column: number }) => {
  return (
    <Box padding="300" borderBlockEndWidth="025" borderColor="border-secondary">
      <InlineStack wrap={false} blockAlign="center" gap="500">
        <Box>
          <SkeletonThumbnail size="extraSmall" />
        </Box>
        {Array.from(Array(column).keys()).map((item, index) => (
          <SkeletonBodyText key={index} lines={1} />
        ))}
      </InlineStack>
    </Box>
  );
};

const SkeletonRowMobile = () => {
  return (
    <Box padding="400" borderBlockEndWidth="025" borderColor="border-secondary">
      <Box width={"150px"} paddingBlockEnd="300">
        <SkeletonBodyText lines={1} />
      </Box>
      <SkeletonBodyText lines={3} />
    </Box>
  );
};

export default SkeletonIndexTable;
