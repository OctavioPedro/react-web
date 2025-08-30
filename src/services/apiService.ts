// API service for communicating with the .NET backend
//const API_BASE_URL = 'https://localhost:7296/api';
const API_BASE_URL = 'https://new-shopping-api-gwg4h7ehgwe5esby.canadacentral-01.azurewebsites.net/api';

export interface ShoppingItemType {
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
}

export interface CreateShoppingItemDto {
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
}

export interface UpdateShoppingItemDto extends CreateShoppingItemDto {
  purchased: boolean;
}

export interface ShoppingStats {
  totalItems: number;
  purchasedItems: number;
  pendingItems: number;
  totalPriceReal: number;
  totalPriceYen: number;
  totalPriceDollar: number;
}

class ApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // GET all shopping items
  async getShoppingItems(): Promise<ShoppingItemType[]> {
    const response = await fetch(`${API_BASE_URL}/ShoppingItems`);
    return this.handleResponse<ShoppingItemType[]>(response);
  }

  // GET single shopping item
  async getShoppingItem(id: number): Promise<ShoppingItemType> {
    const response = await fetch(`${API_BASE_URL}/ShoppingItems/${id}`);
    return this.handleResponse<ShoppingItemType>(response);
  }

  // POST create new shopping item
  async createShoppingItem(item: CreateShoppingItemDto): Promise<ShoppingItemType> {
    const response = await fetch(`${API_BASE_URL}/ShoppingItems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    return this.handleResponse<ShoppingItemType>(response);
  }

  // PUT update shopping item
  async updateShoppingItem(id: number, item: UpdateShoppingItemDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/ShoppingItems/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // PATCH toggle purchased status
  async togglePurchased(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/ShoppingItems/${id}/toggle-purchased`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // DELETE shopping item
  async deleteShoppingItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/ShoppingItems/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // GET shopping statistics
  async getShoppingStats(): Promise<ShoppingStats> {
    const response = await fetch(`${API_BASE_URL}/ShoppingItems/stats`);
    return this.handleResponse<ShoppingStats>(response);
  }
}

export const apiService = new ApiService();
