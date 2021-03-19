type ActionConfirmation = Readonly<{
  isOpen: boolean;
  status: 'success' | 'error';
  message: string;
}>;
