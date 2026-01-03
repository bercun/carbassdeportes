<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
<?php if(isset($useFirebaseDatabase) && $useFirebaseDatabase): ?>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>
<?php endif; ?>
<script src="firebase-config.js"></script>
<?php if(isset($useAuthCheck) && $useAuthCheck): ?>
<script src="auth-check.js"></script>
<?php endif; ?>
