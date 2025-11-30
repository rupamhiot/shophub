import { useState } from "react";
import { Button } from "./_components/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./_components/sheet";
import { Separator } from "./_components/separator";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import {api} from '~/lib/api/client';
import type { components } from '~/lib/api/server-types';
import { useQueryClient } from '@tanstack/react-query';


interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Use query client properly

  // Extract the model/schema types
  const { data: cartItems = [] } = api.useQuery('get', '/api/cart');

  // Mutations: pass path/body when calling mutate since endpoints use {item_id}
  const updateQuantityMutation = api.useMutation('patch', '/api/cart/{item_id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/cart'] });
    },
  });

  const removeItemMutation = api.useMutation('delete', '/api/cart/{item_id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/cart'] });
      toast({
        title: "Item removed",
        description: "Item removed from cart",
      });
    },
  });

  const subtotal = cartItems?.reduce((sum, item) => {
    return (
      sum +
      (item.product
        ? Number(item.product.price) * Number(item.session?.quantity ?? 0)
        : 0)
    );
  }, 0);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    // Provide path param and body for the mutation
    updateQuantityMutation.mutate({
      pathParams: { item_id: itemId },
      body: { quantity: newQuantity },
    });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemMutation.mutate({
      pathParams: { item_id: itemId },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2" data-testid="text-cart-title">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-6">Your cart is empty</p>
              <Button onClick={() => onOpenChange(false)} data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4" data-testid={`cart-item-${item.id}`}>
                  {item.product && (
                    <>
                      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-card">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-1 mb-1" data-testid={`text-cart-item-name-${item.id}`}>
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          ${Number(item.product.price).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleUpdateQuantity(item.id, Number(item.session?.quantity ?? 1) - 1)}
                              disabled={updateQuantityMutation.isLoading}
                              data-testid={`button-cart-decrease-${item.id}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 text-sm" data-testid={`text-cart-quantity-${item.id}`}>
                              {item.session?.quantity ?? 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleUpdateQuantity(item.id, Number(item.session?.quantity ?? 1) + 1)}
                              disabled={updateQuantityMutation.isLoading}
                              data-testid={`button-cart-increase-${item.id}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removeItemMutation.isLoading}
                            data-testid={`button-cart-remove-${item.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="font-semibold" data-testid={`text-cart-item-total-${item.id}`}>
                        ${(Number(item.product.price) * Number(item.session?.quantity ?? 0)).toFixed(2)}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-6 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span data-testid="text-cart-subtotal">${subtotal.toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg" data-testid="button-checkout">
              Proceed to Checkout
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onOpenChange(false)}
              data-testid="button-continue-shopping-footer"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}