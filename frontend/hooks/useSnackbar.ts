import { useSnackbar as useMuiSnackbar } from 'notistack';

export function useSnackbar() {
  const { enqueueSnackbar } = useMuiSnackbar();

  const showSnackbar = (message: string, variant: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    enqueueSnackbar(message, { variant });
  };

  return { showSnackbar };
}

