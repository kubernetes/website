echo "Installing libraries"

while true; 
do
    python -m pip install requests
    python -m pip install click
    python -m pip install jinja2
done

echo "Installation complete!"
