import React from "react";
import { useState, useEffect } from 'react';
import { AddItemForm } from './components/AddItemForm';
import { ShoppingItem } from './components/ShoppingItem';
import { ShoppingStats } from './components/ShoppingStats';
import { FilterPanel } from './components/FilterPanel';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { LoadingSpinner } from './components/ui/loading-spinner';
import { Filter, Plus, ShoppingBag, CheckCircle, X, AlertCircle, RotateCcw } from 'lucide-react';
import { apiService, ShoppingItemType, CreateShoppingItemDto, UpdateShoppingItemDto } from './services/apiService';
import { toast } from 'sonner';

export default function App() {
  const [items, setItems] = useState<ShoppingItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [togglingItemId, setTogglingItemId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItemType | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    region: '',
    forWhom: ''
  });

  // Load items on component mount
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoadError(false);
      setLoading(true);
      const data = await apiService.getShoppingItems();
      setItems(data);
    } catch (error) {
      toast.error('Erro ao carregar itens');
      console.error('Error loading items:', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (newItem: CreateShoppingItemDto) => {
    try {
      setAddingItem(true);
      const createdItem = await apiService.createShoppingItem(newItem);
      setItems(prev => [createdItem, ...prev]);
      setShowForm(false);
      toast.success('Item adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar item');
      console.error('Error adding item:', error);
    } finally {
      setAddingItem(false);
    }
  };

  const updateItem = async (updatedItem: UpdateShoppingItemDto) => {
    if (!editingItem) return;
    
    try {
      setUpdatingItem(true);
      await apiService.updateShoppingItem(editingItem.id, updatedItem);
      setItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...updatedItem, updatedAt: new Date().toISOString() }
          : item
      ));
      setEditingItem(null);
      toast.success('Item atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar item');
      console.error('Error updating item:', error);
    } finally {
      setUpdatingItem(false);
    }
  };

  const togglePurchased = async (id: number) => {
    try {
      setTogglingItemId(id);
      await apiService.togglePurchased(id);
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, purchased: !item.purchased, updatedAt: new Date().toISOString() } : item
      ));
      toast.success('Status atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error('Error toggling purchased:', error);
    } finally {
      setTogglingItemId(null);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      setDeletingItemId(id);
      await apiService.deleteShoppingItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Item removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover item');
      console.error('Error deleting item:', error);
    } finally {
      setDeletingItemId(null);
    }
  };

  const startEditing = (item: ShoppingItemType) => {
    setEditingItem(item);
    setShowForm(false);
  };

  const cancelEditing = () => {
    setEditingItem(null);
  };

  // Filter logic
  const applyFilters = (itemList: ShoppingItemType[]) => {
    return itemList.filter(item => {
      return (
        (filters.category === '' || item.category === filters.category) &&
        (filters.city === '' || item.city === filters.city) &&
        (filters.region === '' || item.region.toLowerCase().includes(filters.region.toLowerCase())) &&
        (filters.forWhom === '' || item.forWhom.toLowerCase().includes(filters.forWhom.toLowerCase()))
      );
    });
  };

  const filteredItems = applyFilters(items);
  const allItems = filteredItems;
  const pendingItems = filteredItems.filter(item => !item.purchased);
  const purchasedItems = filteredItems.filter(item => item.purchased);

  const hasActiveFilters = filters.category || filters.city || filters.region || filters.forWhom;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-3 py-4 max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Lista de Compras - Japão 🇯🇵</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus itens com conversão Real/Yen/Dólar
          </p>
        </div>

        <ShoppingStats items={items} />

        {loading && (
          <div className="mb-3">
            <LoadingSpinner
              size="sm"
              text="Carregando itens..."
              className="py-2"
            />
          </div>
        )}

        {/* Loading animations positioned below headers */}
        {(addingItem || updatingItem) && (
          <div className="mb-4">
            <LoadingSpinner 
              size="sm" 
              text={addingItem ? "Adicionando item..." : "Atualizando item..."} 
              className="py-2"
            />
          </div>
        )}

        {!loading && !loadError && (
          <div className="mb-4">
            {!showForm && !editingItem ? (
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowForm(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  size="lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Novo Item
                </Button>
                
                {items.length > 0 && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex-1"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filtros {hasActiveFilters && '(ativo)'}
                    </Button>
                    {hasActiveFilters && (
                      <Button 
                        variant="outline" 
                        onClick={() => setFilters({ category: '', city: '', region: '', forWhom: '' })}
                        size="sm"
                        className="px-3"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <AddItemForm 
                  onAddItem={addItem}
                  onUpdateItem={updateItem}
                  editingItem={editingItem}
                  isEditing={!!editingItem}
                  isLoading={addingItem || updatingItem}
                />
                <Button 
                  variant="outline" 
                  onClick={editingItem ? cancelEditing : () => setShowForm(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        )}

        {showFilters && items.length > 0 && (
          <div className="mb-4">
            <FilterPanel 
              filters={filters}
              onFiltersChange={setFilters}
              items={items}
            />
          </div>
        )}

        {loadError ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Não foi possível carregar os itens</h3>
            <p className="text-sm text-muted-foreground mb-4">Verifique sua conexão e tente novamente.</p>
            <Button onClick={loadItems} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        ) : items.length > 0 ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all" className="text-xs">
                Todos ({allItems.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">
                Pendentes ({pendingItems.length})
              </TabsTrigger>
              <TabsTrigger value="purchased" className="text-xs">
                Comprados ({purchasedItems.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {allItems.map(item => (
                  <div key={item.id}>
                    <ShoppingItem
                      id={item.id}
                      itemName={item.itemName}
                      image={item.image}
                      storeName={item.storeName}
                      category={item.category}
                      city={item.city}
                      region={item.region}
                      forWhom={item.forWhom}
                      priceReal={item.priceReal}
                      priceYen={item.priceYen}
                      priceDollar={item.priceDollar}
                      purchased={item.purchased}
                      createdAt={item.createdAt}
                      updatedAt={item.updatedAt}
                      onTogglePurchased={togglePurchased}
                      onDelete={deleteItem}
                      onEdit={startEditing}
                      isToggling={togglingItemId === item.id}
                      isDeleting={deletingItemId === item.id}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-4">
              {pendingItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {pendingItems.map(item => (
                    <div key={item.id}>
                      <ShoppingItem
                        id={item.id}
                        itemName={item.itemName}
                        image={item.image}
                        storeName={item.storeName}
                        category={item.category}
                        city={item.city}
                        region={item.region}
                        forWhom={item.forWhom}
                        priceReal={item.priceReal}
                        priceYen={item.priceYen}
                        priceDollar={item.priceDollar}
                        purchased={item.purchased}
                        createdAt={item.createdAt}
                        updatedAt={item.updatedAt}
                        onTogglePurchased={togglePurchased}
                        onDelete={deleteItem}
                        onEdit={startEditing}
                        isToggling={togglingItemId === item.id}
                        isDeleting={deletingItemId === item.id}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nenhum item pendente</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="purchased" className="mt-4">
              {purchasedItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {purchasedItems.map(item => (
                    <div key={item.id}>
                      <ShoppingItem
                        id={item.id}
                        itemName={item.itemName}
                        image={item.image}
                        storeName={item.storeName}
                        category={item.category}
                        city={item.city}
                        region={item.region}
                        forWhom={item.forWhom}
                        priceReal={item.priceReal}
                        priceYen={item.priceYen}
                        priceDollar={item.priceDollar}
                        purchased={item.purchased}
                        createdAt={item.createdAt}
                        updatedAt={item.updatedAt}
                        onTogglePurchased={togglePurchased}
                        onDelete={deleteItem}
                        onEdit={startEditing}
                        isToggling={togglingItemId === item.id}
                        isDeleting={deletingItemId === item.id}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nenhum item comprado ainda</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          !loading && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Sua lista está vazia</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione seu primeiro item de compra
              </p>
              <Button onClick={() => setShowForm(true)} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Item
              </Button>
            </div>
          )
        )}
      </div>
      <Toaster />
    </div>
  );
}