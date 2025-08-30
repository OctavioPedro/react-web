import { Card, CardContent } from './ui/card';
import { ShoppingBag, CheckCircle, DollarSign, Coins, Banknote } from 'lucide-react';

interface ShoppingItem {
  id: string;
  itemName: string;
  image: string;
  storeName: string;
  category: string;
  city: string;
  region: string;
  forWhom: string;
  priceReal: number;
  priceYen: number;
  priceDollar: number;
  purchased: boolean;
}

interface ShoppingStatsProps {
  items: ShoppingItem[];
}

export function ShoppingStats({ items }: ShoppingStatsProps) {
  const totalItems = items.length;
  const purchasedItems = items.filter(item => item.purchased).length;
  const totalReal = items.reduce((sum, item) => sum + item.priceReal, 0);
  const totalYen = items.reduce((sum, item) => sum + item.priceYen, 0);
  const totalDollar = items.reduce((sum, item) => sum + item.priceDollar, 0);
  const purchasedReal = items.filter(item => item.purchased).reduce((sum, item) => sum + item.priceReal, 0);
  const purchasedYen = items.filter(item => item.purchased).reduce((sum, item) => sum + item.priceYen, 0);
  const purchasedDollar = items.filter(item => item.purchased).reduce((sum, item) => sum + item.priceDollar, 0);

  const stats = [
    {
      title: "Itens",
      value: totalItems,
      icon: ShoppingBag,
      color: "text-blue-600"
    },
    {
      title: "Comprados",
      value: `${purchasedItems}/${totalItems}`,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Yen",
      value: `¥ ${Math.round(totalYen / 1000)}k`,
      icon: Coins,
      color: "text-orange-600",
      spent: purchasedYen
    },
    {
      title: "Real",
      value: `R$ ${Math.round(totalReal)}`,
      icon: DollarSign,
      color: "text-purple-600",
      spent: purchasedReal
    },
    {
      title: "Dólar",
      value: `$ ${totalDollar.toFixed(0)}`,
      icon: Banknote,
      color: "text-emerald-600",
      spent: purchasedDollar
    }
  ];

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-4">
      <div className="grid grid-cols-2 gap-2">
        {stats.slice(0, 2).map((stat, index) => (
          <Card key={index} className="p-0">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-muted-foreground">
                  {stat.title}
                </div>
                <stat.icon className={`h-3 w-3 ${stat.color}`} />
              </div>
              <div className="font-semibold text-sm">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {stats.slice(2).map((stat, index) => (
          <Card key={index + 2} className="p-0">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-muted-foreground">
                  {stat.title}
                </div>
                <stat.icon className={`h-3 w-3 ${stat.color}`} />
              </div>
              <div className="font-semibold text-xs">{stat.value}</div>
              {stat.spent !== undefined && purchasedItems > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.title === 'Real' && `R$ ${Math.round(stat.spent)}`}
                  {stat.title === 'Dólar' && `$ ${stat.spent.toFixed(0)}`}
                  {stat.title === 'Yen' && `¥ ${Math.round(stat.spent / 1000)}k`}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}