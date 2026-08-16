import 'dart:convert';
import 'package:flutter/material.dart';
import '../../../core/api/api_client.dart';

class AiAssistantScreen extends StatefulWidget {
  const AiAssistantScreen({super.key});

  @override
  State<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends State<AiAssistantScreen> {
  final _promptController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      'sender': 'ai',
      'text': 'Halo! Saya AI Assistant Desa Jombe. Ada yang bisa saya bantu mengenai syarat permohonan surat atau info desa?',
    }
  ];
  bool _loading = false;

  Future<void> _sendMessage() async {
    final text = _promptController.text.trim();
    if (text.isEmpty || _loading) return;

    _promptController.clear();
    setState(() {
      _messages.add({'sender': 'user', 'text': text});
      _loading = true;
    });

    try {
      final res = await ApiClient.post('/ai/chat', {'prompt': text});
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data['status'] == 'success') {
          setState(() {
            _messages.add({
              'sender': 'ai',
              'text': data['data']['reply'],
            });
          });
        }
      }
    } catch (e) {
      setState(() {
        _messages.add({'sender': 'ai', 'text': 'Maaf, terjadi kendala saat menghubungi AI Assistant.'});
      });
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFCFBF7),
      appBar: AppBar(
        backgroundColor: const Color(0xFF15803D),
        foregroundColor: Colors.white,
        title: const Text('AI Assistant Desa Jombe', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['sender'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  container: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
                    decoration: BoxDecoration(
                      color: isUser ? const Color(0xFF15803D) : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 4, offset: const Offset(0, 2)),
                      ],
                    ),
                    child: Text(
                      msg['text'] ?? '',
                      style: TextStyle(
                        fontSize: 12,
                        color: isUser ? Colors.white : Colors.black87,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          if (_loading)
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2)),
                  SizedBox(width: 8),
                  Text('AI sedang mengetik...', style: TextStyle(fontSize: 11, color: Colors.grey)),
                ],
              ),
            ),
          Container(
            padding: const EdgeInsets.all(12),
            color: Colors.white,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _promptController,
                    decoration: InputDecoration(
                      hintText: 'Tanyakan sesuatu seputar surat...',
                      hintStyle: const TextStyle(fontSize: 12),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(20)),
                      contentPadding: const EdgeInsets.horizontal(16, vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.send, color: Color(0xFF15803D)),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
