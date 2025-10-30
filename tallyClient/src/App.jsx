import AppRouter from './routes/AppRouter';
import AuthProvider from './context/AuthContext';
import DataProvider from './context/DataContext'; // Import DataProvider

function App() {
  return (
    <AuthProvider>
      <DataProvider> {/* Wrap AppRouter with DataProvider */}
        <AppRouter />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;