with open('index.html', 'r') as f:
    content = f.read()

# I want to make sure the modal is inside the body
if '<div id="narrative-modal"' in content:
    print("Modal is already in index.html")
