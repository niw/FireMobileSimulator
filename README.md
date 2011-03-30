FireMobileSimulator
===================

Branches
--------

This fork repository includes many branches fetched from [coderepos](http://coderepos.org/share) svn repository,
also this is tracking curret releases(version 1.1.x) as ``master`` branch, so far.

Original [thorikawa](https://github.com/thorikawa/FireMobileSimulator)-san's [``master`` branch](https://github.com/thorikawa/FireMobileSimulator/tree/master) is **NOT** same as this ``master`` branch,
but same as ``coderepos/master`` branch, which has a reference to the same tree object, different commit object though.

The orignal and coderepos repository, branches are really complicated, many duplicated commits which are pointing same tree objects.
This graph shows how these branches are related.

                                     thorikawa/master
                     b2d891  93ef14  coderepos/master
        fe91ae o-------o-------o-------o
               |       : ← similar but different tree object
               |       :
               |       o-------o
               |     92359e  coderepos/1.1.0
               |          
        122bff o---------------o
               |             coderepos/0.2.1
               |
        775998 o---------------o
               |             coderepos/OLD_1.1.1
               |
        bd7510 o---------------o
               ↑             thorikawa/1.1.X
        same tree object     master
