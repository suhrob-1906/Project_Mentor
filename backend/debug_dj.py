import dj_database_url

def test(url):
    print(f"Testing '{url}'")
    try:
        res = dj_database_url.parse(url)
        print("Success:", res)
    except Exception as e:
        print("Error:", e)

test("://user:pass@host/db")
test("postgres://user:pass@host/db")
test("user:pass@host/db")
test("host")
