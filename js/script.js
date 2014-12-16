var lightboxApp = angular.module('lightBox', []);

lightboxApp.controller('lightBox', function ($scope, $http, $filter) {
    "use strict";
    $scope.lstPhoto = [];
    $scope.lstAuteur = [];
    $scope.lstNote = [];
    $scope.grandePhoto = [];
    $scope.ordreTri = "-created";
    $scope.revTri = false;
    $scope.lstOK = false;
    $scope.lstTemplate = [
        {
            name: 'Vignettes',
            url: 'templates/vignettePhoto.html'
        },
        {
            name: 'Petites vignettes',
            url: 'templates/petiteVignettePhoto.html'
        },
        {
            name: 'Toute petites vignettes',
            url: 'templates/tresPetiteVignettePhoto.html'
        }
    ];
    $scope.nbMaxPhoto = 50;
    $scope.curTemplate = $scope.lstTemplate[0].url;

    $scope.visuImage = function (photo) {
        $scope.grandePhoto.url = photo.field_image_1;
        $scope.grandePhoto.titre = photo.title;
        $scope.grandePhoto.descr = photo.field_desc_photo;
        return 0;
    };

    $http.get('flux-photo.php').success(function (data) {
        var i, count,
            auteur, tmpLstAuteur, newAuteur,
            tmpLstNote, note, newNote, regNote,
            tmpLstNbComment, nb, newNb;
        $scope.lstPhoto = data;
        // Ajout du champ URL
        for (i in $scope.lstPhoto) {
            $scope.lstPhoto[i].url = $scope.lstPhoto[i].field_image;
            $scope.lstPhoto[i].grand = false;
        }

        // Récupération de la liste des auteurs
        tmpLstAuteur = $scope.lstPhoto.reduce(function (sum, photo) {
            if (sum.indexOf(photo.name) < 0) {
                sum.push(photo.name);
            }
            return sum;
        }, []);
        for (auteur in tmpLstAuteur.sort()) {
            newAuteur = {
                "name": tmpLstAuteur[auteur]
            };
            $scope.lstAuteur.push(newAuteur);
        }

        // Récupération des différentes notes
        tmpLstNote = $scope.lstPhoto.reduce(function (sum, photo) {
            if (sum.indexOf(photo.field_vote) < 0) {
                sum.push(photo.field_vote.replace(regNote, "$1"));
            }
            return sum;
        }, []);
        for (note in tmpLstNote.sort()) {
            newNote = {
                "note": tmpLstNote[note],
                "lib": tmpLstNote[note].replace("0/5", "Pas noté")
            };
            $scope.lstNote.push(newNote);
        }

        //        // Récupération des différents nombres de commentaires
        //        tmpLstNbComment = $scope.lstPhoto.reduce(function (sum, photo) {
        //            if (sum.indexOf(photo.comment_count) < 0) {
        //                sum.push(photo.comment_count);
        //            }
        //            return sum;
        //        }, []);
        //        for (nb in tmpLstNbComment.sort()) {
        //            newNb = {
        //                "nb_comment": tmpLstNbComment[nb]
        //            };
        //            $scope.lstNbComment.push(newNb);
        //        }

        $scope.lstOK = true;
    });

});