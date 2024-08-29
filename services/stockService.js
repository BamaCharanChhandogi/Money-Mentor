export async function getStockPrice(symbol) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a random price between 50 and 200
    return Math.random() * (200 - 50) + 50;
  }
