function generarStringAleatorio(longitud) {
  var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var texto = '';
  
  for (var i = 0; i < longitud; i++) {
    var posicion = Math.floor(Math.random() * caracteres.length);
    texto = texto + caracteres.charAt(posicion);
  }
  
  return texto;
}

export function getSpotifyAuthUrl() {
  var clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
  var redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || '';
  var state = generarStringAleatorio(16);

  if (typeof window !== 'undefined') {
    localStorage.setItem('spotify_auth_state', state);
  }

  var scope = 'user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private';

  var params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: scope
  });

  var url = 'https://accounts.spotify.com/authorize?' + params.toString();
  return url;
}

export function saveTokens(accessToken, refreshToken, expiresIn) {
  var expiracion = Date.now() + expiresIn * 1000;
  localStorage.setItem('spotify_token', accessToken);
  localStorage.setItem('spotify_refresh_token', refreshToken);
  localStorage.setItem('spotify_token_expiration', expiracion.toString());
}

export function getAccessToken() {
  var token = localStorage.getItem('spotify_token');
  var expiracion = localStorage.getItem('spotify_token_expiration');
  
  if (!token) {
    return null;
  }
  
  if (!expiracion) {
    return null;
  }
  
  var ahora = Date.now();
  var tiempoExpiracion = parseInt(expiracion);
  
  if (ahora > tiempoExpiracion) {
    return null;
  }
  
  return token;
}

export function isAuthenticated() {
  var token = getAccessToken();
  if (token !== null) {
    return true;
  } else {
    return false;
  }
}

export function logout() {
  localStorage.removeItem('spotify_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiration');
}