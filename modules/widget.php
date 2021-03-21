<?php if ($currency == 'nano'): ?>

<img id="monkey" src="static/themes/my1/img/qr-code.png" 
title="QR code for <?php echo $nanoNodeAccount; ?>"
style="max-width:250px; display:block; margin: 48px 0 0 auto;" />

<?php elseif($currency == 'banano'): ?>

<img id="monkey" src="https://bananomonkeys.herokuapp.com/image?address=<?php echo $nanoNodeAccount; ?>" 
title="monKey for <?php echo $nanoNodeAccount; ?>"
style="max-width:250px; display:block; margin: 0 0 0 auto;" />

<?php endif; ?>