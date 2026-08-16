import 'package:flutter/material.dart';
import 'features/home/screens/home_screen.dart';
import 'features/auth/screens/login_screen.dart';
import 'core/storage/secure_storage.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const JombeDigitalApp());
}

class JombeDigitalApp extends StatelessWidget {
  const JombeDigitalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'JOMBE DIGITAL',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF15803D), // Hijau Desa Utama
          primary: const Color(0xFF15803D),
          secondary: const Color(0xFFFEF3C7),
          surface: const Color(0xFFFCFBF7),
        ),
        fontFamily: 'Roboto',
      ),
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    await Future.delayed(const Duration(seconds: 2));
    final token = await SecureStorage.getToken();
    if (!mounted) return;

    if (token != null && token.isNotEmpty) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    } else {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF14532D),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(
                Icons.apartment,
                size: 48,
                color: Color(0xFF15803D),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'JOMBE DIGITAL',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Pelayanan Desa Jombe dalam Genggaman',
              style: TextStyle(
                fontSize: 12,
                color: Color(0xFFBBF7D0),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
