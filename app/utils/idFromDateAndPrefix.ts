/**
 *
 * @param prefix
 * A simple function to generate a dummy date ID from the JS Date Object, with or without specifying a prefix
 * @returns :string formated as prefix_AAAA_MM_DD_TIMESTAMP
 */
export const idFromDateAndPrefix = (prefix = 'VHCL_') => {
  // var timestamp = String(new Date().getTime());
  return (
    prefix +
    new Date()
      .toISOString()
      .replace(/-/g, '_')
      .replace(/:/g, '_')
      .replace(/\./g, '_')
  );
};
