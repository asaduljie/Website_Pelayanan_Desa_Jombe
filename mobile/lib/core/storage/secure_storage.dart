import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  static const _storage = FlutterSecureStorage();

  static const String _keyToken = 'jombe_jwt_token';
  static const String _keyUser = 'jombe_user_json';

  static Future<void> saveToken(String token) async {
    await _storage.write(key: _keyToken, value: token);
  }

  static Future<String?> getToken() async {
    return await _storage.read(key: _keyToken);
  }

  static Future<void> saveUser(String userJson) async {
    await _storage.write(key: _keyUser, value: userJson);
  }

  static Future<String?> getUser() async {
    return await _storage.read(key: _keyUser);
  }

  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
