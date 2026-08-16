import 'dart:convert';
import 'package:flutter/material.dart';
import '../../../core/api/api_client.dart';
import '../../../core/storage/secure_storage.dart';
import '../../auth/screens/login_screen.dart';
import '../../ai/screens/ai_assistant_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  Map<String, dynamic>? _user;
  List<dynamic> _myApplications = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadUser();
    _fetchApplications();
  }

  Future<void> _loadUser() async {
    final userJson = await SecureStorage.getUser();
    if (userJson != null) {
      setState(() => _user = jsonDecode(userJson));
    }
  }

  Future<void> _fetchApplications() async {
    try {
      final res = await ApiClient.get('/applications/my');
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data['status'] == 'success') {
          setState(() => _myApplications = data['data']);
        }
      }
    } catch (e) {
      print('Fetch Error: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _logout() async {
    await SecureStorage.clearAll();
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final userName = _user?['name'] ?? 'Warga';

    return Scaffold(
      backgroundColor: const Color(0xFFFCFBF7),
      appBar: AppBar(
        backgroundColor: const Color(0xFF15803D),
        elevation: 0,
        title: Row(
          children: [
            const Icon(Icons.apartment, color: Colors.white),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'JOMBE DIGITAL',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                Text(
                  'Halo, $userName',
                  style: const TextStyle(fontSize: 11, color: Color(0xFFBBF7D0)),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.smart_toy_outlined, color: Colors.white),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const AiAssistantScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: _logout,
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Bar Header
            Container(
              padding: const EdgeInsets.all(16),
              color: const Color(0xFF15803D),
              child: Container(
                padding: const EdgeInsets.horizontal(12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.search, color: Colors.grey),
                    SizedBox(width: 8),
                    Text('Cari layanan surat...', style: TextStyle(color: Colors.grey, fontSize: 13)),
                  ],
                ),
              ),
            ),

            // Quick Services Grid
            Padding(
              aria-label: 'Quick Services',
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Layanan Utama', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildQuickItem(Icons.description, 'Surat', const Color(0xFFFEF3C7), const Color(0xFFB45309)),
                      _buildQuickItem(Icons.home, 'Administrasi', const Color(0xFFDBEAFE), const Color(0xFF1D4ED8)),
                      _buildQuickItem(Icons.volunteer_activism, 'Bantuan', const Color(0xFFDCFCE7), const Color(0xFF15803D)),
                      _buildQuickItem(Icons.report_problem, 'Pengaduan', const Color(0xFFF3E8FF), const Color(0xFF6B21A8)),
                    ],
                  ),
                ],
              ),
            ),

            // Applications List Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Permohonan Terbaru Saya', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                      TextButton(
                        onPressed: () {},
                        child: const Text('Lihat Semua', style: TextStyle(fontSize: 12, color: Color(0xFF15803D))),
                      ),
                    ],
                  ),
                  _loading
                      ? const Center(child: CircularProgressIndicator())
                      : _myApplications.isEmpty
                          ? Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.grey.shade200),
                              ),
                              child: const Center(
                                child: Text('Belum ada permohonan surat.', style: TextStyle(fontSize: 12, color: Colors.grey)),
                              ),
                            )
                          : ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _myApplications.length,
                              itemBuilder: (context, index) {
                                final app = _myApplications[index];
                                return Card(
                                  margin: const EdgeInsets.only(bottom: 8),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  child: ListTile(
                                    title: Text(app['service']['name'] ?? 'Surat', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                                    subtitle: Text('Nomor: ${app['applicationNumber']}', style: const TextStyle(fontSize: 11)),
                                    trailing: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFDCFCE7),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        app['status'] ?? 'PENDING',
                                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                ],
              ),
            ),
          ],
        ),
      ),

      // AI Floating Button
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const AiAssistantScreen()),
          );
        },
        backgroundColor: const Color(0xFF15803D),
        icon: const Icon(Icons.smart_toy, color: Colors.white),
        label: const Text('AI Jombe', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),

      // Bottom Navigation Bar
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        selectedItemColor: const Color(0xFF15803D),
        unselectedItemColor: Colors.grey,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.assignment), label: 'Layanan'),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Permohonan'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),
        ],
      ),
    );
  }

  Widget _buildQuickItem(IconData icon, String label, Color bgColor, Color iconColor) {
    return Column(
      children: [
        Container(
          width: 54,
          height: 54,
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(icon, color: iconColor, size: 26),
        ),
        const SizedBox(height: 6),
        Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
      ],
    );
  }
}
