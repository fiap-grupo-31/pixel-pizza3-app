
export const OrdersAdapter = {
  adaptSortOrdersOpen: async function (data: Array<any>, column1: string, column2: string): Promise<any> {
    return data.sort((a, b) => {

        if (a[column1] < b[column1]) {
          return -1;
        }
        if (a[column1] > b[column1]) {
          return 1;
        }

        if (a[column2] < b[column2]) {
          return -1;
        }
        if (a[column2] > b[column2]) {
          return 1;
        }
      return 0;
    });
  },
};