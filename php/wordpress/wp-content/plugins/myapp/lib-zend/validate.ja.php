<?php
/**
 * Zend_Validate のエラー文言日本語対応表
 * bdcard2 customized.
 */
return array(
    // Zend_Validate_Alnum
    "Invalid type given. String, integer or float expected" => "不正な形式です。文字列、整数もしくは小数が期待されています",
    "'%value%' contains characters which are non alphabetic and no digits" => "'%value%' にアルファベットと数字以外の文字が含まれています",
    "'%value%' is an empty string" => "'%value%' は空の文字列です",

    // Zend_Validate_Alpha
    "Invalid type given. String expected" => "不正な形式です。文字列が期待されています",
    "'%value%' contains non alphabetic characters" => "'%value%' にアルファベット以外の文字が含まれています",
    "'%value%' is an empty string" => "'%value%' は空の文字列です",

    // Zend_Validate_Between
    "'%value%' is not between '%min%' and '%max%', inclusively" => "'%value%' は '%min%' 以上 '%max%' 以下ではありません",
    "'%value%' is not strictly between '%min%' and '%max%'" => "'%value%' は '%min%' 以下か '%max%' 以上です",

    // Zend_Validate_Callback
    "'%value%' is not valid" => "'%value%' は正しくありません",
    "An exception has been raised within the callback" => "コールバック内で例外が発生しました",

    // Zend_Validate_CreditCard
    "%value%' seems to contain an invalid checksum" => "'%value%' は不正なチェックサムを含んでいるようです",
    "'%value%' must contain only digits" => "'%value%' は数値だけで構成される必要があります",
    "Invalid type given. String expected" => "不正な形式です。文字列が期待されています",
    "'%value%' contains an invalid amount of digits" => "'%value%' は不正な桁数です",
    "'%value%' is not from an allowed institute" => "'%value%' は認可機関から許可されていません",
    "%value%' seems to be an invalid creditcard number" => "'%value%' は不正なクレジットカード番号を含んでいるようです",
    "An exception has been raised while validating '%value%" => "'%value%' を検証中に例外が発生しました",

    // Zend_Validate_Date
    "Invalid type given, value should be string, integer, array or Zend_Date" => "不正な形式です。値は文字列、整数、配列もしくは Zend_Date 形式である必要があります",
    "'%value%' does not appear to be a valid date" => "'%value%' は正しい日付ではないようです",
    "'%value%' does not fit the date format '%format%'" => "'%value%' は '%format%' フォーマットに一致していません",

    // Zend_Validate_Db_Abstract
    "No record matching '%value%' was found" => " '%value%' に一致するレコードは見つかりませんでした",
    "A record matching '%value%' was found" => " '%value%' に一致するレコードが見つかりました",

    // Zend_Validate_Digits
    "Invalid type given. String, integer or float expected" => "不正な形式です。文字列、整数または小数が期待されています",
    "%value%' must contain only digits" => "'%value%' は数字のみである必要があります",
    "'%value%' is an empty string" => "'%value%' は空の文字列です",

    // Zend_Validate_EmailAddress
    "Invalid type given. String expected" => "不正な形式です。文字列が期待されています",
    "'%value%' is no valid email address in the basic format local-part@hostname" => "'%value%' はメールアドレスの基本的な形式 local-part@hostname ではありません",
    "'%hostname%' is no valid hostname for email address '%value%'" => "メールアドレス '%value%' 内の '%hostname%' は有効なホスト名ではありません",
    "'%hostname%' does not appear to have a valid MX record for the email address '%value%'" => "メールアドレス '%value%' 内の '%hostname%' は有効な MX レコードではないようです",
    "'%hostname%' is not in a routable network segment. The email address '%value%' should not be resolved from public network" => "'%hostname%' はネットワークセグメントにありません。メールアドレス '%value%' はパブリックなネットワークから名前解決できませんでした",
    "'%localPart%' can not be matched against dot-atom format" => "'%localPart%' はドットアトム形式ではありません",
    "'%localPart%' can not be matched against quoted-string format" => "'%localPart%' は引用文字列形式ではありません",
    "'%localPart%' is no valid local part for email address '%value%'" => "メールアドレス '%value%' 内の '%localPart%' は有効なローカルパートではありません",
    "'%value%' exceeds the allowed length" => "'%value%' は許された長さを超えています",

    // Zend_Validate_File_Count
    "Too many files, maximum '%max%' are allowed but '%count%' are given" => "ファイル数が多すぎます。最大 '%max%' まで許されていますが、 '%count%' 個指定ました",
    "Too few files, minimum '%min%' are expected but '%count%' are given" => "ファイル数が少なすぎます。最小 '%min%' 以上の必要がありますが、 '%count%' 個指定されていません",

    // Zend_Validate_File_ExcludeExtension
    "File '%value%' has a false extension" => "ファイル '%value%' は誤った拡張子です",
    "File '%value%' is not readable or does not exist" => "ファイル '%value%' は読み込めないかもしくは存在しません",

    // Zend_Validate_File_ExcludeMimeType
    "File '%value%' has a false mimetype of '%type%'" => "ファイル '%value%' は誤った mimetype '%type%' です",
    "The mimetype of file '%value%' could not be detected" => "ファイル '%value%' の mimetype が見つかりませんでした",
    "File '%value%' is not readable or does not exist" => "ファイル '%value%' は読み込めないかもしくは存在しません",

    // Zend_Validate_File_Exists
    "File '%value%' does not exist" => "ファイル '%value%' は存在しません",

    // Zend_Validate_File_Extension
    "File '%value%' has a false extension" => "ファイル '%value%' は誤った拡張子です",
    "File '%value%' is not readable or does not exist" => "ファイル '%value%' は読み込めないかもしくは存在しません",

    // Zend_Validate_File_FilesSize
    "All files in sum should have a maximum size of '%max%' but '%size%' were detected" => "全てのファイルの合計は最大 '%max%' より小さい必要があります。しかしファイルサイズは '%size%' でした",
    "All files in sum should have a minimum size of '%min%' but '%size%' were detected" => "全てのファイルの合計は最小 '%min%' より大きい必要があります。しかしファイルサイズは '%size%' でした",
    "One or more files can not be read" => "ファイルを読み込めませんでした",

    // Zend_Validate_File_ImageSize
    "Maximum allowed width for image '%value%' should be '%maxwidth%' but '%width%' detected" => "画像 '%value%' の横幅は '%width%' でした。横幅は最大 '%maxwidth%' まで許されています",
    "Minimum expected width for image '%value%' should be '%minwidth%' but '%width%' detected" => "画像 '%value%' の横幅は '%width%' でした。横幅は最小 '%minwidth%' 以上である必要があります",
    "Maximum allowed height for image '%value%' should be '%maxheight%' but '%height%' detected" => "画像 '%value%' の高さは '%height%' でした。高さは最大 '%maxheight%' まで許されています",
    "Minimum expected height for image '%value%' should be '%minheight%' but '%height%' detected" => "画像 '%value%' の高さは '%height%' でした。高さは最小 '%minheight%' 以上である必要があります",
    "The size of image '%value%' could not be detected" => "画像 '%value%' の大きさを取得できませんでした",
    "File '%value%' is not readable or does not exist" => "ファイル '%value%' は読み込めないかもしくは存在しません",

    // Zend_Validate_File_IsImage
    "File '%value%' is no image, '%type%' detected" => "ファイル '%value%' は画像ではありません。 '%type%' です",
    "The mimetype of file '%value%' could not be detected" => "ファイル '%value%' の Mimetype は見つかりませんでした",
    "File '%value%' is not readable or does not exist" => "ファイル '%value%' は読み込めないかもしくは存在しません",

    // Zend_Validate_File_MimeType
    "File '%value%' has a false mimetype of '%type%'" => "ファイル '%value%' は誤った MimeType '%type%' です",
    "The mimetype of file '%value%' could not be detected" => "ファイル '%value%' の Mimetype は見つかりませんでした",
    "File '%value%' is not readable or does not exist" => "ファイル '%value%' は読み込めないかもしくは存在しません",

    // Zend_Validate_File_NotExists
    "File '%value%' exists" => "ファイル '%value%' は存在しています",
    // Zend_Validate_File_Size
    "Maximum allowed size for file '%value%' is '%max%' but '%size%' detected" => "ファイルサイズは '%size%' です。ファイル '%value%' のサイズは最大 '%max%' まで許されています",
    "Minimum expected size for file '%value%' is '%min%' but '%size%' detected" => "ファイルサイズは '%size%' です。ファイル '%value%' のサイズは最小 '%min%' 以上必要です",
    "File '%value%' is not readable or does not exist" => "ファイル '%value%' は読み込めないかもしくは存在しません",

    // Zend_Validate_File_Upload
    "File '%value%' exceeds the defined ini size" => "ファイル '%value%' は ini で定義されたサイズを超えています",
    "File '%value%' exceeds the defined form size" => "ファイル '%value%' はフォームで定義されたサイズを超えています",
    "File '%value%' was only partially uploaded" => "ファイル '%value%' は一部のみしかアップロードされていません",
    "File '%value%' was not uploaded" => "ファイル '%value%' はアップロードされませんでした",
    "No temporary directory was found for file '%value%'" => "ファイル '%value%' をアップロードする一時ディレクトリが見つかりませんでした",
    "File '%value%' can't be written" => "ファイル '%value%' は書き込めませんでした",
    "A PHP extension returned an error while uploading the file '%value%'" => "ファイル '%value%' をアップロード中に拡張モジュールがエラーを応答しました",
    "File '%value%' was illegally uploaded. This could be a possible attack" => "ファイル '%value%' は不正なアップロードでした。攻撃の可能性があります",
    "File '%value%' was not found" => "ファイル '%value%' は見つかりませんでした",
    "Unknown error while uploading file '%value%'" => "ファイル '%value%' をアップロード中に未知のエラーが発生しました",

    // Zend_Validate_Float
    "Invalid type given. String, integer or float expected" => "不正な形式です。文字列、整数もしくは小数が期待されています",
    "'%value%' does not appear to be a float" => " '%value%' は小数ではないようです",

    // Zend_Validate_GreaterThan
    "'%value%' is not greater than '%min%'" => " '%value%' は '%min%' より大きくありません",

    // Zend_Validate_Hex
    "Invalid type given. String expected" => "不正な形式です。文字列が期待されています",
    "'%value%' has not only hexadecimal digit characters" => " '%value%' は 16 進文字列以外を含んでいます",

    // Zend_Validate_Identical
    "The two given tokens do not match" => "2 つのトークンは一致しませんでした",
    "No token was provided to match against" => "チェックを行うためのトークンがありませんでした",

    // Zend_Validate_InArray
    "'%value%' was not found in the haystack" => " '%value%' は選択候補外です",

    // Zend_Validate_Int
    "Invalid type given. String or integer expected" => "不正な形式です。文字列または整数が期待されています",
    "'%value%' does not appear to be an integer" => " '%value%' は整数ではないようです",

    // Zend_Validate_LessThan
    "'%value%' is not less than '%max%'" => " '%value%' は '%max%' 未満ではありません",

    // Zend_Validate_NotEmpty
    "Invalid type given. String, integer, float, boolean or array expected" => "不正な形式です。文字列、整数、小数、真偽値もしくは配列が期待されています",
    "Value is required and can't be empty" => "値は必須です。空値は許可されていません",

    // Zend_Validate_Regex
    "Invalid type given. String, integer or float expected" => "不正な形式です。文字列、整数、もしくは小数が期待されています",
    "'%value%' does not match against pattern '%pattern%'" => " '%value%' は不正な形式です",
    "There was an internal error while using the pattern '%pattern%'" => "正規表現パターン '%pattern%' を使用中に内部エラーが発生しました。",
);
