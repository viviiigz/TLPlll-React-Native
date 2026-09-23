import { Redirect } from 'expo-router';

export default function RedireccionPedido() {
  // redirige a la rls del carrito
  return <Redirect href="/carrito" />;
}