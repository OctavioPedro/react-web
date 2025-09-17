import React from "react";
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from './ui/dialog';
import { Check, Trash2, MapPin, Store, Edit, Building, Expand, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShoppingItemType } from '../services/apiService';

interface ShoppingItemProps {
  id: number;
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
  createdAt: string;
  updatedAt?: string;
  onTogglePurchased: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (item: ShoppingItemType) => void;
  isToggling?: boolean;
  isDeleting?: boolean;
}

export function ShoppingItem({
  id,
  itemName,
  image,
  storeName,
  category,
  city,
  region,
  forWhom,
  priceReal,
  priceYen,
  priceDollar,
  purchased,
  createdAt,
  updatedAt,
  onTogglePurchased,
  onDelete,
  onEdit,
  isToggling = false,
  isDeleting = false
}: ShoppingItemProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleEdit = () => {
    const itemData: ShoppingItemType = {
      id,
      itemName,
      image,
      storeName,
      category,
      city,
      region,
      forWhom,
      priceReal,
      priceYen,
      priceDollar,
      purchased,
      createdAt,
      updatedAt
    };
    onEdit(itemData);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cosméticos': return '🧴';
      case 'Eletrônicos': return '📱';
      case 'Coisas Geek': return '🎮';
      case 'Comida': return '🍜';
      case 'Arte': return '🎨';
      default: return '🛍️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cosméticos': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Eletrônicos': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Coisas Geek': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Comida': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Arte': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className={`h-full flex flex-col transition-all duration-200 hover:shadow-md border ${purchased ? 'opacity-60 bg-muted/50' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'}`}>
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Imagem no topo */}
        <div className="relative">
          {image ? (
            <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
              <DialogTrigger asChild>
                <div className="relative cursor-pointer group">
                  <ImageWithFallback
                    src={image}
                    alt={itemName}
                    className="w-full h-32 object-cover rounded-t-lg transition-all duration-200 group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-black/50 rounded-full p-2">
                      <Expand className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl w-[90vw] h-[80vh] p-0">
                <DialogTitle className="sr-only">Imagem ampliada de {itemName}</DialogTitle>
                <DialogDescription className="sr-only">
                  Visualização em tamanho completo da imagem do item {itemName}
                </DialogDescription>
                <div className="relative w-full h-full flex items-center justify-center bg-black/5 rounded-lg">
                  <ImageWithFallback
                    src={image}
                    alt={itemName}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="w-full h-32 bg-muted rounded-t-lg flex items-center justify-center">
              <Store className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          {purchased && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-100 text-green-700">
                ✓ Comprado
              </Badge>
            </div>
          )}
        </div>

        {/* Conteúdo do card */}
        <div className="p-3 space-y-3 flex-1 flex flex-col">
          {/* Nome do item */}
          <div className="text-center">
            <h3 className={`font-semibold text-sm leading-tight ${purchased ? 'line-through' : ''}`}>
              {itemName}
            </h3>
          </div>

          {/* Tags de categoria e loja */}
          <div className="flex flex-wrap justify-center gap-1 min-h-[20px]">
            <Badge variant="outline" className={`text-xs px-2 py-1 whitespace-nowrap ${getCategoryColor(category)}`}>
              {getCategoryIcon(category)} {category}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border-emerald-200 whitespace-nowrap">
              <Store className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate max-w-[80px]">{storeName}</span>
            </Badge>
          </div>

          {/* Tags de cidade e região */}
          <div className="flex flex-wrap justify-center gap-1 min-h-[20px]">
            <Badge variant="outline" className="text-xs px-2 py-1 bg-sky-50 text-sky-700 border-sky-200 whitespace-nowrap">
              <Building className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate max-w-[60px]">{city}</span>
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-1 bg-violet-50 text-violet-700 border-violet-200 whitespace-nowrap">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate max-w-[60px]">{region}</span>
            </Badge>
          </div>

          {/* Tag para quem */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs px-2 py-1 bg-rose-50 text-rose-700 border-rose-200 whitespace-nowrap">
              👤 <span className="truncate max-w-[100px]">{forWhom}</span>
            </Badge>
          </div>

          {/* Preços */}
          {(priceYen > 0 || priceReal > 0 || priceDollar > 0) && (
            <div className="text-center space-y-1">
              <div className={`font-semibold text-lg ${purchased ? 'line-through' : ''}`}>
                ¥ {priceYen.toLocaleString()}
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span className={purchased ? 'line-through' : ''}>
                  R$ {priceReal.toFixed(2)}
                </span>
                <span className={purchased ? 'line-through' : ''}>
                  $ {priceDollar.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="space-y-2 mt-auto">
            {/* Botão Comprei - largura total */}
            <Button
              variant={purchased ? "default" : "outline"}
              size="sm"
              onClick={() => onTogglePurchased(id)}
              disabled={isToggling || isDeleting}
              className="w-full flex items-center justify-center gap-2 text-sm py-2"
              style={{ 
                backgroundColor: purchased ? '#10b981' : 'transparent', 
                borderColor: '#10b981', 
                color: purchased ? 'white' : '#10b981' 
              }}
            >
              {isToggling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {isToggling ? 'Atualizando...' : 'Comprei'}
            </Button>
            
            {/* Botões de Edição e Exclusão - lado a lado */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                disabled={isToggling || isDeleting}
                className="flex items-center justify-center gap-1 text-xs py-2 border-slate-300 hover:border-slate-400"
              >
                <Edit className="w-3 h-3" />
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(id)}
                disabled={isToggling || isDeleting}
                className="flex items-center justify-center gap-1 text-xs py-2"
              >
                {isDeleting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}