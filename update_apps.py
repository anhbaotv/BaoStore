import json
import requests

# CẤU HÌNH CÁC APP CẦN TỰ ĐỘNG CẬP NHẬT
# Dựa trên ID và Category trong file Baoapp.json của bạn
AUTO_UPDATE_APPS = {
    "Youtube2": { # SmartTube Stable
        "repo": "yuliskov/SmartTube",
        "keyword": "stable",
        "category": "Youtube"
    },
    "Youtube3": { # SmartTube Beta
        "repo": "yuliskov/SmartTube",
        "keyword": "beta",
        "category": "Youtube"
    }
}

def get_latest_github_release(repo, keyword):
    """Hàm quét API của GitHub để lấy link APK và version mới nhất"""
    url = f"https://api.github.com/repos/{repo}/releases"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            releases = response.json()
            for release in releases:
                for asset in release.get('assets', []):
                    # Tìm file .apk và có chứa từ khóa (stable/beta)
                    if asset['name'].endswith('.apk') and keyword.lower() in asset['name'].lower():
                        # Lấy version (bỏ chữ 'v' ở đầu nếu có)
                        version = release['tag_name'].replace('v', '')
                        download_url = asset['browser_download_url']
                        # Lấy mô tả cập nhật
                        changelog = release.get('body', 'Bản cập nhật tự động mới nhất.').split('\n')[0] 
                        return version, download_url, changelog
    except Exception as e:
        print(f"Lỗi khi quét {repo}: {e}")
    return None, None, None

def main():
    # 1. Mở và đọc file Baoapp.json hiện tại
    try:
        with open('Baoapp.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Lỗi đọc file Baoapp.json: {e}")
        return

    is_changed = False

    # 2. Quét và cập nhật
    for app_id, config in AUTO_UPDATE_APPS.items():
        cat = config['category']
        if cat in data:
            for i, app in enumerate(data[cat]):
                if app['id'] == app_id:
                    print(f"Đang kiểm tra cập nhật cho {app['title']}...")
                    new_version, new_url, new_changelog = get_latest_github_release(config['repo'], config['keyword'])
                    
                    if new_version and new_url:
                        # Nếu version trên mạng khác version trong file JSON thì cập nhật
                        if app.get('version') != new_version:
                            print(f">>> Đã tìm thấy bản mới: {new_version}. Đang cập nhật JSON!")
                            data[cat][i]['version'] = new_version
                            data[cat][i]['downloadUrl'] = new_url
                            data[cat][i]['changelog'] = f"Tính năng mới:\n{new_changelog}"
                            is_changed = True
                        else:
                            print(">>> Ứng dụng đã ở phiên bản mới nhất.")

    # 3. Ghi lại file JSON nếu có sự thay đổi
    if is_changed:
        with open('Baoapp.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print("Đã ghi đè Baoapp.json thành công!")
    else:
        print("Không có ứng dụng nào cần cập nhật.")

if __name__ == "__main__":
    main()