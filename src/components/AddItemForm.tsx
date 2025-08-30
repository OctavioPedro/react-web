import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Edit, Camera, Image as ImageIcon, Link, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ShoppingItemType, CreateShoppingItemDto, UpdateShoppingItemDto } from '../services/apiService';

interface AddItemFormProps {
  onAddItem: (item: CreateShoppingItemDto) => void;
  onUpdateItem?: (item: UpdateShoppingItemDto) => void;
  editingItem?: ShoppingItemType | null;
  isEditing?: boolean;
}

export function AddItemForm({ onAddItem, onUpdateItem, editingItem, isEditing = false }: AddItemFormProps) {
  const [itemName, setItemName] = useState('');
  const [image, setImage] = useState('');
  const [imageMethod, setImageMethod] = useState<'url' | 'gallery' | 'camera'>('url');
  const [storeName, setStoreName] = useState('');
  const [category, setCategory] = useState(''); 
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [forWhom, setForWhom] = useState('');
  const [priceReal, setPriceReal] = useState('');
  const [priceYen, setPriceYen] = useState('');
  const [priceDollar, setPriceDollar] = useState('');
  const [isCapturingCamera, setIsCapturingCamera] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const YEN_TO_REAL_RATE = 0.034;
  const DOLLAR_TO_REAL_RATE = 5.20;

  // Load editing item data
  useEffect(() => {
    if (editingItem) {
      setItemName(editingItem.itemName);
      setImage(editingItem.image);
      setStoreName(editingItem.storeName);
      setCategory(editingItem.category);
      setCity(editingItem.city);
      setRegion(editingItem.region);
      setForWhom(editingItem.forWhom);
      setPriceReal(editingItem.priceReal ? editingItem.priceReal.toString() : '');
      setPriceYen(editingItem.priceYen ? editingItem.priceYen.toString() : '');
      setPriceDollar(editingItem.priceDollar ? editingItem.priceDollar.toString() : '');
    }
  }, [editingItem]);

  // Cleanup da câmera quando componente é desmontado
  useEffect(() => {
    return () => {
      stopCameraCapture();
    };
  }, []);

  // Função para converter arquivo para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Função para lidar com seleção da galeria
  const handleGallerySelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        try {
          const base64 = await fileToBase64(file);
          setImage(base64);
          toast.success('Imagem selecionada da galeria!');
        } catch (error) {
          toast.error('Erro ao processar imagem');
        }
      } else {
        toast.error('Por favor, selecione um arquivo de imagem');
      }
    }
  };

  // Função para iniciar captura da câmera
  const startCameraCapture = async () => {
    try {
      setIsCapturingCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Usa câmera traseira se disponível
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error('Erro ao acessar câmera. Verifique as permissões.');
      setIsCapturingCamera(false);
    }
  };

  // Função para capturar foto da câmera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        setImage(base64);
        stopCameraCapture();
        toast.success('Foto capturada!');
      }
    }
  };

  // Função para parar captura da câmera
  const stopCameraCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturingCamera(false);
  };

  // Função para limpar imagem
  const clearImage = () => {
    setImage('');
    stopCameraCapture();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageMethodChange = (method: 'url' | 'gallery' | 'camera') => {
    setImageMethod(method);
    clearImage();
    
    if (method === 'gallery') {
      fileInputRef.current?.click();
    } else if (method === 'camera') {
      startCameraCapture();
    }
  };

  const handleRealChange = (value: string) => {
    setPriceReal(value);
    if (value && !isNaN(Number(value))) {
      const realValue = Number(value);
      const yenValue = (realValue / YEN_TO_REAL_RATE).toFixed(0);
      const dollarValue = (realValue / DOLLAR_TO_REAL_RATE).toFixed(2);
      setPriceYen(yenValue);
      setPriceDollar(dollarValue);
    } else {
      setPriceYen('');
      setPriceDollar('');
    }
  };

  const handleYenChange = (value: string) => {
    setPriceYen(value);
    if (value && !isNaN(Number(value))) {
      const yenValue = Number(value);
      const realValue = (yenValue * YEN_TO_REAL_RATE).toFixed(2);
      const dollarValue = (Number(realValue) / DOLLAR_TO_REAL_RATE).toFixed(2);
      setPriceReal(realValue);
      setPriceDollar(dollarValue);
    } else {
      setPriceReal('');
      setPriceDollar('');
    }
  };

  const handleDollarChange = (value: string) => {
    setPriceDollar(value);
    if (value && !isNaN(Number(value))) {
      const dollarValue = Number(value);
      const realValue = (dollarValue * DOLLAR_TO_REAL_RATE).toFixed(2);
      const yenValue = (Number(realValue) / YEN_TO_REAL_RATE).toFixed(0);
      setPriceReal(realValue);
      setPriceYen(yenValue);
    } else {
      setPriceReal('');
      setPriceYen('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName || !storeName || !category || !city || !region || !forWhom) {
      return;
    }

    const itemData = {
      itemName,
      image: image || '',
      storeName,
      category,
      city,
      region,
      forWhom,
      priceReal: priceReal ? Number(priceReal) : 0,
      priceYen: priceYen ? Number(priceYen) : 0,
      priceDollar: priceDollar ? Number(priceDollar) : 0
    };

    if (isEditing && onUpdateItem) {
      onUpdateItem({
        ...itemData,
        purchased: editingItem?.purchased || false
      });
    } else {
      onAddItem(itemData);
    }

    // Reset form only if not editing
    if (!isEditing) {
      setItemName('');
      clearImage();
      setImageMethod('url');
      setStoreName('');
      setCategory('');
      setCity('');
      setRegion('');
      setForWhom('');
      setPriceReal('');
      setPriceYen('');
      setPriceDollar('');
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          {isEditing ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isEditing ? 'Editar Item' : 'Adicionar Novo Item'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-5">
            {/* Nome do item */}
            <div className="space-y-2">
              <Label htmlFor="itemName" className="text-slate-700 font-medium">Nome do Item *</Label>
              <Input
                id="itemName"
                placeholder="Ex: Nintendo Switch, Kimono..."
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
                className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-200"
              />
            </div>

            {/* Opções de imagem */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Imagem (opcional)</Label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <Button
                  type="button"
                  variant={imageMethod === 'url' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleImageMethodChange('url')}
                  className="text-xs p-2"
                >
                  <Link className="w-3 h-3 mr-1" />
                  URL
                </Button>
                <Button
                  type="button"
                  variant={imageMethod === 'gallery' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleImageMethodChange('gallery')}
                  className="text-xs p-2"
                >
                  <ImageIcon className="w-3 h-3 mr-1" />
                  Galeria
                </Button>
                <Button
                  type="button"
                  variant={imageMethod === 'camera' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleImageMethodChange('camera')}
                  className="text-xs p-2"
                >
                  <Camera className="w-3 h-3 mr-1" />
                  Foto
                </Button>
              </div>
              
              {/* Input file oculto para galeria */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleGallerySelect}
                className="hidden"
              />
              
              {imageMethod === 'url' && (
                <Input
                  id="image"
                  type="url"
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                />
              )}
              
              {/* Preview da imagem selecionada */}
              {image && !isCapturingCamera && (
                <div className="relative">
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={clearImage}
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              
              {/* Interface da câmera */}
              {isCapturingCamera && (
                <div className="space-y-2">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-48 object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      onClick={capturePhoto}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Capturar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={stopCameraCapture}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Loja */}
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-slate-700 font-medium">Loja *</Label>
              <Input
                id="storeName"
                placeholder="Ex: Don Quijote, Bic Camera..."
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-200"
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-700 font-medium">Categoria *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-200">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cosméticos">🧴 Cosméticos</SelectItem>
                  <SelectItem value="Eletrônicos">📱 Eletrônicos</SelectItem>
                  <SelectItem value="Coisas Geek">🎮 Coisas Geek</SelectItem>
                  <SelectItem value="Comida">🍜 Comida</SelectItem>
                  <SelectItem value="Arte">🎨 Arte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cidade e Região */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-slate-700 font-medium">Cidade *</Label>
                <Select value={city} onValueChange={setCity} required>
                  <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-200">
                    <SelectValue placeholder="Cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tóquio">🗼 Tóquio</SelectItem>
                    <SelectItem value="Osaka">🏯 Osaka</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region" className="text-slate-700 font-medium">Região *</Label>
                <Input
                  id="region"
                  placeholder="Ex: Shibuya, Namba..."
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                  className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Para quem */}
            <div className="space-y-2">
              <Label htmlFor="forWhom" className="text-slate-700 font-medium">Para quem *</Label>
              <Input
                id="forWhom"
                placeholder="Ex: Minha esposa, João, Para mim..."
                value={forWhom}
                onChange={(e) => setForWhom(e.target.value)}
                required
                className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-200"
              />
            </div>
            
            {/* Preços (opcionais) */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-slate-700 font-medium">💰 Preços (opcionais)</Label>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="priceYen" className="text-xs text-slate-600">Yen (¥)</Label>
                  <Input
                    id="priceYen"
                    type="number"
                    placeholder="0"
                    value={priceYen}
                    onChange={(e) => handleYenChange(e.target.value)}
                    className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priceReal" className="text-xs text-slate-600">Real (R$)</Label>
                  <Input
                    id="priceReal"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={priceReal}
                    onChange={(e) => handleRealChange(e.target.value)}
                    className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priceDollar" className="text-xs text-slate-600">Dólar ($)</Label>
                  <Input
                    id="priceDollar"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={priceDollar}
                    onChange={(e) => handleDollarChange(e.target.value)}
                    className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
              </div>
              
              <div className="text-xs text-slate-500 text-center">
                <p>Conversão automática (Wise): 1¥ = R$ 0,034 | 1$ = R$ 5,20</p>
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg h-12">
            {isEditing ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isEditing ? 'Salvar Alterações' : 'Adicionar Item'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}