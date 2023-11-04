import { Products } from "src/domain/entities";

interface ProductsOut {
  nome: string;
  id: string;
}

export const ProductsAdapter = {
  adaptJsonProducts: function (dados: Products[] | null): string {
    if (dados === null) {
      return JSON.stringify({});
    }
    let alldata = dados.map(function (item) {
      return { name: item.name, id: item.id };
    });
    return JSON.stringify(alldata);
  },
};
