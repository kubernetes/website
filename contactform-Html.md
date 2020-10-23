<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CONTACT FORM DESIGN</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <div class="Contact-Title">
        <h1>Say HELLO </h1>
        <h2>We are always here to serve you</h2>

    </div>
    <div class="contact-Form">
        <form id="contact-Form" method="post" action="index.php">
            <input name="name" type="text" class="form-control" placeholder="Your Name" required>
            <br>
            <input name="email" type="email" class="form-control" placeholder="Your email" required>
            <br>
            <textarea name="message" class="form-control" placeholder="Message" cols="10" rows="4" required></textarea>
            <br>

            <input type="submit" class="form-control submit" value="SEND MESSAGE">





        </form>

    </div>
</body>
</html>

