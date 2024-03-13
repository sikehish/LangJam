import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch all categories
export const getCategories = (token: string) => {
  return useQuery({queryKey: ['categories'], queryFn: async () => {
    const response = await fetch('/api/entities/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Unable to fetch categories');
    }

    return response.json();
}});
};

// Create a new category
export const createCategory = (newCategoryName: string, token: string) => {
  return useMutation({
    mutationFn: async (newCategoryName) => {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newCategoryName }),
        });
  
        if (!response.ok) {
          throw new Error('Unable to create category');
        }

        return response.json(); 
      },
      onSuccess: (data) => {
      },
  }
  );
};

// Edit a category
export const editCategory = (categoryId: string, newName: string, token: string) => {
  return useMutation({
    mutationFn: async ({ categoryId, newName }: { categoryId: string, newName: string }) => {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, 
            },
            body: JSON.stringify({ name: newName }),
        });
        if (!response.ok) throw new Error('Unable to edit category');
        return response.json();
    },    
      onSuccess: (data) => {
      },
  });
};

// Delete a category
export const deleteCategory = (categoryId: string, token: string) => {
    return useMutation({
       mutationFn: async (categoryId) => {
            const response = await fetch(`/api/admin/categories/${categoryId}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            });
      
            if (!response.ok) {
              throw new Error('Unable to delete category');
            }
      
            return response.json(); 
          },
          onSuccess: () => {
          },
        });
};
