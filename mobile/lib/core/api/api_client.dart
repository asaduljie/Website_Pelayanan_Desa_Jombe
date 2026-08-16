import 'dart:convert';
import 'package:http/http.dart' as http;
import '../storage/secure_storage.dart';

class ApiClient {
  // Ganti IP ke IP backend server atau localhost emulator (10.0.2.2 untuk Android Emulator)
  static const String baseUrl = 'http://10.0.2.2:5000/api';

  static Future<Map<String, String>> _getHeaders() async {
    final token = await SecureStorage.getToken();
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  static Future<http.Response> get(String endpoint) async {
    final headers = await _getHeaders();
    return await http.get(Uri.parse('$baseUrl$endpoint'), headers: headers);
  }

  static Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    final headers = await _getHeaders();
    return await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    );
  }
}
