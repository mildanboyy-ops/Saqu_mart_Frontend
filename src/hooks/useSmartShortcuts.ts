import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useSmartShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            navigate('/dashboard');
            toast.success("Navigating to Dashboard");
            break;
          case 'p':
            e.preventDefault();
            navigate('/pos');
            toast.success("Opening POS Console");
            break;
          case 'i':
            e.preventDefault();
            navigate('/products');
            toast.success("Opening Inventory Management");
            break;
          case 'm':
            e.preventDefault();
            navigate('/members');
            toast.success("Opening Member Management");
            break;
          case 's':
            e.preventDefault();
            navigate('/settings');
            toast.success("Opening System Settings");
            break;
          case 'k':
            e.preventDefault();
            // Command palette handled elsewhere but good to note
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
}
