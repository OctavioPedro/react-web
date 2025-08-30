import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Filter } from 'lucide-react';

interface ShoppingItem {
  category: string;
  city: string;
  region: string;
  forWhom: string;
}

interface FilterPanelProps {
  filters: {
    category: string;
    city: string;
    region: string;
    forWhom: string;
  };
  onFiltersChange: (filters: any) => void;
  items: ShoppingItem[];
}

export function FilterPanel({ filters, onFiltersChange, items }: FilterPanelProps) {
  const categories = ['Cosméticos', 'Eletrônicos', 'Coisas Geek', 'Comida', 'Arte'];
  const cities = [...new Set(items.map(item => item.city))].filter(Boolean);
  const regions = [...new Set(items.map(item => item.region))].filter(Boolean);

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value
    });
  };

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-2">
            <Label className="text-sm text-slate-700">Categoria</Label>
            <Select value={filters.category || 'all'} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm text-slate-700">Cidade</Label>
              <Select value={filters.city || 'all'} onValueChange={(value) => updateFilter('city', value)}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm text-slate-700">Região</Label>
              <Input
                placeholder="Digite a região..."
                value={filters.region}
                onChange={(e) => updateFilter('region', e.target.value)}
                className="bg-white border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-slate-700">Para quem</Label>
            <Input
              placeholder="Digite para quem é..."
              value={filters.forWhom}
              onChange={(e) => updateFilter('forWhom', e.target.value)}
              className="bg-white border-slate-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}