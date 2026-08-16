import 'dart:convert';
import 'package:flutter/material.dart';
import '../../../core/api/api_client.dart';
import '../../../core/storage/secure_storage.dart';
import '../../home/screens/home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _nikController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _handleLogin() async {
    final nik = _nikController.text.trim();
    final password = _passwordController.text.trim();

    if (nik.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'NIK dan kata sandi wajib diisi.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await ApiClient.post('/auth/login', {
        'nik': nik,
        'password': password,
      });

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['status'] == 'success') {
        final token = data['data']['token'];
        final user = data['data']['user'];

        await SecureStorage.saveToken(token);
        await SecureStorage.saveUser(jsonEncode(user));

        if (!mounted) return;
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const HomeScreen()),
        );
      } else {
        setState(() => _errorMessage = data['message'] ?? 'Gagal login.');
      }
    } catch (e) {
      setState(() => _errorMessage = 'Gagal menghubungi server backend.');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFCFBF7),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 40),
              Center(
                child: Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: const Color(0xFF15803D),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.apartment, color: Colors.white, size: 36),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Masuk JOMBE DIGITAL',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF14532D),
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Pelayanan Desa Jombe dalam Genggaman',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              const SizedBox(height: 32),

              if (_errorMessage != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEE2E2),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFFCA5A5)),
                  ),
                  child: Text(
                    _errorMessage!,
                    style: const TextStyle(fontSize: 12, color: Color(0xFF991B1B)),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              TextField(
                controller: _nikController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'NIK (Nomor Induk Kependudukan)',
                  prefixIcon: const Icon(Icons.badge_outlined),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 16),

              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Kata Sandi',
                  prefixIcon: const Icon(Icons.lock_outline),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 24),

              ElevatedButton(
                onPressed: _isLoading ? null : _handleLogin,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF15803D),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : const Text('Masuk ke Sistem', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 16),

              OutlinedButton(
                onPressed: () {
                  _nikController.text = '3512345678900001';
                  _passwordController.text = 'password123';
                },
                child: const Text('Isi Demo Warga (3512345678900001)'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
