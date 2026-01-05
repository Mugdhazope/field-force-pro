import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, Search, TrendingUp } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';

export const MRProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  // Mock weekly promotion data
  const productsWithStats = mockProducts.map(product => ({
    ...product,
    weeklyPromotions: Math.floor(Math.random() * 15),
    monthlyPromotions: Math.floor(Math.random() * 50),
  }));

  const filteredProducts = productsWithStats.filter(
    product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const categories = [...new Set(filteredProducts.map(p => p.category))];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Products"
        description="View and track product promotions"
        icon={Package}
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products by Category */}
      {categories.map(category => (
        <div key={category}>
          <h2 className="text-lg font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts
              .filter(p => p.category === category)
              .map(product => {
                const weeklyProgress = (product.weeklyPromotions / product.targetFrequency) * 100;
                const isOnTarget = weeklyProgress >= 100;

                return (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.sku}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={isOnTarget 
                            ? "bg-success/10 text-success border-success/20" 
                            : "bg-warning/10 text-warning border-warning/20"
                          }
                        >
                          {isOnTarget ? 'On Target' : 'Below Target'}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Weekly Progress */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Weekly Target</span>
                          <span className="font-medium">
                            {product.weeklyPromotions} / {product.targetFrequency}
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(weeklyProgress, 100)} 
                          className="h-2"
                        />
                      </div>

                      {/* Stats */}
                      <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">This Week</p>
                          <p className="text-lg font-semibold flex items-center gap-1">
                            {product.weeklyPromotions}
                            <TrendingUp className="h-4 w-4 text-success" />
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">This Month</p>
                          <p className="text-lg font-semibold">{product.monthlyPromotions}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
